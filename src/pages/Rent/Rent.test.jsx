/* eslint-disable testing-library/await-async-query */
import { render, screen } from '@testing-library/react';
import { Rent } from ".";

describe("Add rent button", () => {
  test("should be able to render the button to add rent", () => {
    render(<Rent />);

    const title = screen.findByText("Adicionar aluguel");

    expect(title).toBeDefined();    
  });
});

describe("Render table", () => {
  test("should be able to render the table of rents", () => {
    render(<Rent />);

    const id = screen.findByText("ID");

    expect(id).toBeDefined();    
  });
});

