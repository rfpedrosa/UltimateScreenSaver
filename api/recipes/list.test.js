import * as handler from './list';
import * as event from '../mocks/list-event';

jest.mock('../shared/dynamodb', () => ({
  call: jest.fn().mockImplementation(query => {
    return {
      Items: []
    };
  })
}))

test('successul response', async () => {
  const context = 'context';

  var response = await handler.main(event, context);
  expect(response.statusCode).toEqual(200);
  expect(typeof response.body).toBe("string");
});

