import './env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, raw } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // Middleware to handle raw body for Stripe webhook
  app.use('/payments/webhook', raw({ type: 'application/json' }));
  
  // Increase body size limit for file uploads (50MB)
  app.use(json({ limit: '50mb' }));

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
}
bootstrap();
