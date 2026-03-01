import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { Request } from 'express';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createCheckoutSession(data: { assetId: string; userId: string }) {
    const { assetId, userId } = data;

    // For now, use test buyer if no valid user provided
    const finalUserId = userId && userId !== 'user-1' ? userId : 'buyer_123';

    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new BadRequestException('Asset not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: asset.name,
              description: asset.description,
            },
            unit_amount: Math.round(asset.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata: {
        assetId,
        userId,
      },
    });

    // Create order with pending status
    await this.prisma.order.create({
      data: {
        userId: finalUserId,
        assetId,
        total: asset.price,
        status: 'PENDING',
        stripeSessionId: session.id,
      },
    });

    return { sessionId: session.id, url: session.url };
  }

  async getSessionDetails(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return {
        id: session.id,
        metadata: session.metadata,
        payment_status: session.payment_status,
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve session details');
    }
  }

  async handleStripeWebhook(req: Request) {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      throw new BadRequestException('STRIPE_WEBHOOK_SECRET is not set');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.id) {
        // Update order status to PAID
        await this.prisma.order.update({
          where: { stripeSessionId: session.id },
          data: { status: 'PAID' },
        });
      }
    }

    return { received: true };
  }
}
