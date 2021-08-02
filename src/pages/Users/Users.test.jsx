/* eslint-disable testing-library/await-async-query */
import { render, screen } from '@testing-library/react';
import { Users } from ".";

describe("Add users button", () => {

  test("should be able to render the button to add user", () => {
    render(<Users />);

    const add = screen.findByText("Adicionar usuário");

    expect(add).toBeDefined();    
  });
});

describe("Render users table", () => {
  test("should be able to render the users table", () => {
    render(<Users />);

    const table = screen.findByText("ID");

    expect(table).toBeDefined();    
  });
});

