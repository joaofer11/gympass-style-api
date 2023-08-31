import fastify from 'fastify';
import { scheduleAppRoutes } from './http/schedule-app-routes';

export const app = fastify();

app.register(scheduleAppRoutes);
