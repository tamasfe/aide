import { describe, it, expect } from "vitest";
import { camelize, camelizeKeys } from "~/utils";

describe("camelize util unit tests", async () => {
  it("correctly transforms snake_case to camelCase", () => {
    expect(camelize("snake_case")).toBe("snakeCase");
  });
});

describe("camelizeKeys util unit tests", async () => {
  it("correctly transforms an object from snake_case to camelCase", () => {
    expect(
      camelizeKeys(
        {
          some_null: null,
          hello_there: "some_snake_case_that_should_not_change",
          alreadyInCamelCase: "should_not_change",
          nested_object: {
            more_snake: "should_not_change_1",
            moreCamel: "should_not_change_2",
            nested_nested_object: {
              even_more_snake: "should_not_not_change",
            },
          },
          arrays_too: [
            { some_snake: "should_not_change_3" },
            { some_snake: "should_not_change_4" },
            null, undefined, 1, "string", true,
          ],
        },
      )).toEqual(
      {
        someNull: null,
        helloThere: "some_snake_case_that_should_not_change",
        alreadyInCamelCase: "should_not_change",
        nestedObject: {
          moreSnake: "should_not_change_1",
          moreCamel: "should_not_change_2",
          nestedNestedObject: {
            evenMoreSnake: "should_not_not_change",
          },
        },
        arraysToo: [
          { someSnake: "should_not_change_3" },
          { someSnake: "should_not_change_4" },
          null, undefined, 1, "string", true,
        ],
      });
  });
});
