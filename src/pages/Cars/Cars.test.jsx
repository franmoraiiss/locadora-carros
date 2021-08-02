/* eslint-disable testing-library/await-async-query */
import { render, screen } from '@testing-library/react';
import { Cars } from ".";

describe("Add button cars", () => {
  test("should be able to render the button to add cars", () => {
    render(<Cars />);

    const title = screen.findByText("Adicionar carro");

    expect(title).toBeDefined();    
  });
});


