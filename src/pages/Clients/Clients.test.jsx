/* eslint-disable testing-library/await-async-query */
import { render, screen } from '@testing-library/react';
import { Clients } from ".";

describe("Welcome Text", () => {
  test("should be able to render the button to add users", () => {
    render(<Clients />);

    const title = screen.findByText("Adicionar usuário");

    expect(title).toBeDefined();    
  });
});


