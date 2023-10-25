import { NextApiHandler } from 'next';
import { context, Span, trace } from '@opentelemetry/api';

const TrackedTestsMiddleware = <T>(handler: NextApiHandler<T>): NextApiHandler<T> => {
  return async (request, response) => {
    let span;
    let headers = request.headers;
    
    // Check if there is an active span
    if (trace.getActiveSpan() === undefined) {
      await handler(request, response);
      return;
    }

    // Continue the current trace/span
    span = trace.getSpan(context.active()) as Span;
    if (headers['trackedtest.name'] != null) {
      span.setAttribute('trackedtest.name', headers['trackedtest.name']);
    }
    if (headers['trackedtest.suite'] != null) {
      span.setAttribute('trackedtest.suite', headers['trackedtest.suite']);
    }
    if (headers['trackedtest.invocation_id'] != null) {
      span.setAttribute('trackedtest.invocation_id', headers['trackedtest.invocation_id']);
    }
    if (headers['trackedtest.type'] != null) {
      span.setAttribute('trackedtest.type', headers['trackedtest.type']);
    }

    await handler(request, response);
  };
};

export default TrackedTestsMiddleware;
