import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import helmet from 'helmet';

const redisClient = createClient();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  redisClient.connect().catch(console.error);
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'inverstee-management:',
  });
  app.use(
    session({
      store: redisStore,
      secret: 'keyboard cat', // should be in env for production
      resave: false,
      saveUninitialized: false,
      cookie: {
        // secure: false, // true => production
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Investees management')
    .setDescription('The API manages potential investees/companies info')
    .setVersion('1.0')
    .addTag('investees')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, documentFactory);
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['POST', 'PUT', 'DELETE', 'GET', 'PATCH'],
    credentials: true,
  });
  await app.listen(8000);
}
bootstrap();
