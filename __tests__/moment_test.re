open Jest;
open Expect;
open! Expect.Operators;

describe("Expect", () => {

  test("toBe", () =>
    expect(1 + 2) |> toBe(3))
});

describe("Instant", () => {
    open Time;
    open Time.Instant;
    

    test("instant", () =>
      expect(Time.Instant.make()) === ());

    test("instant round trip", () =>
      expect(decodedInstant) === ());
  }
);

