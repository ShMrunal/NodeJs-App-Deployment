const request = require("supertest");
const app = require("./app"); // This imports the Express app
const calculate = require("./app").calculate; // This imports the calculate function

let server;

beforeAll(() => {
  // Start the server before running tests
  server = app.listen(3000); // Adjust the port as needed
});

afterAll((done) => {
  // Close the server after all tests are done
  server.close(done);
});

describe("Calculator Functionality", () => {
  describe("Unit Tests for calculate function", () => {
    const calculate = require("./app").calculate; // Import your calculate function if it's exported

    test("adds 1 + 2 to equal 3", () => {
      expect(calculate("1", "2", "+")).toBe(3);
    });

    test("subtracts 5 - 3 to equal 2", () => {
      expect(calculate("5", "3", "-")).toBe(2);
    });

    test("multiplies 4 * 5 to equal 20", () => {
      expect(calculate("4", "5", "*")).toBe(20);
    });

    test("divides 10 / 2 to equal 5", () => {
      expect(calculate("10", "2", "/")).toBe(5);
    });

    test("divides 10 / 0 to return Infinity", () => {
      expect(calculate("10", "0", "/")).toBe("Cannot divide by zero");
    });

    test("calculates the square root of 9 to equal 3", () => {
      expect(calculate("9", "", "√")).toBe(3);
    });

    test("calculates 100 % to equal 1", () => {
      expect(calculate("100", "", "%")).toBe(1);
    });

    test('returns "Invalid operation" for missing input', () => {
      expect(calculate("", "2", "+")).toBe("Invalid operation");
    });
  });

  describe("Integration Tests for POST /calculate", () => {
    test("response with the result of 4 + 5", async () => {
      const response = await request(app)
        .post("/calculate")
        .send({ input1: "4", input2: "5", operation: "+" })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.result).toBe(9);
    });

    test("response with the result of 20 / 0", async () => {
      const response = await request(app)
        .post("/calculate")
        .send({ input1: "20", input2: "0", operation: "/" })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.result).toBe("Cannot divide by zero");
    });

    test('response with "Invalid operation" for unsupported operation', async () => {
      const response = await request(app)
        .post("/calculate")
        .send({ input1: "10", input2: "5", operation: "^" })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.result).toBe("Invalid operation");
    });
  });
});
