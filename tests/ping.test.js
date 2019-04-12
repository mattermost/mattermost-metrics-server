import { promisify } from "util";
import lambda from "../src/ping";
const handler = promisify(lambda);

describe(`Ping`, () => {
  test(`Should ping back`, () => {
    const event = {};
    const context = {};

    const result = handler(event, context);
    expect(result).resolves.toMatchSnapshot();
  });
});
