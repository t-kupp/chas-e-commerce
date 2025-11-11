import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantitySelector from "../../app/components/QuantitySelector";

describe("QuantitySelector", () => {
  it("should render with default quantity of 1", () => {
    render(<QuantitySelector maxStock={10} />);

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue(1);
  });

  it("should increase quantity when increase button is clicked", async () => {
    const user = userEvent.setup();

    render(<QuantitySelector maxStock={10} />);

    const increaseButton = screen.getByRole("button", { name: /increase/i });
    const input = screen.getByRole("spinbutton");

    await user.click(increaseButton);

    expect(input).toHaveValue(2);
  });

  it("should decrease quantity when decrease button is clicked", async () => {
    const user = userEvent.setup();

    render(<QuantitySelector maxStock={10} />);

    const increaseButton = screen.getByRole("button", { name: /increase/i });
    const decreaseButton = screen.getByRole("button", { name: /decrease/i });
    const input = screen.getByRole("spinbutton");

    // Increase to 3
    await user.click(increaseButton);
    await user.click(increaseButton);

    // Decrease to 2
    await user.click(decreaseButton);

    expect(input).toHaveValue(2);
  });

  it("should not decrease below 1", async () => {
    const user = userEvent.setup();

    render(<QuantitySelector maxStock={10} />);

    const decreaseButton = screen.getByRole("button", { name: /decrease/i });
    const input = screen.getByRole("spinbutton");

    // Try to decrease below 1
    await user.click(decreaseButton);
    await user.click(decreaseButton);

    expect(input).toHaveValue(1);
  });

  it("should not increase beyond maxStock", async () => {
    const user = userEvent.setup();

    render(<QuantitySelector maxStock={3} />);

    const increaseButton = screen.getByRole("button", { name: /increase/i });
    const input = screen.getByRole("spinbutton");

    // Try to increase beyond max
    await user.click(increaseButton);
    await user.click(increaseButton);
    await user.click(increaseButton);
    await user.click(increaseButton);

    expect(input).toHaveValue(3);
  });

  it("should call onQuantityChange when quantity changes", async () => {
    const user = userEvent.setup();
    const mockCallback = jest.fn();

    render(<QuantitySelector maxStock={10} onQuantityChange={mockCallback} />);

    const increaseButton = screen.getByRole("button", { name: /increase/i });

    await user.click(increaseButton);

    expect(mockCallback).toHaveBeenCalledWith(2);
  });

  it("should allow manual input of quantity", async () => {
    const user = userEvent.setup();

    render(<QuantitySelector maxStock={10} />);

    const input = screen.getByRole("spinbutton");

    await user.clear(input);
    await user.type(input, "5");

    expect(input).toHaveValue(5);
  });

  it("should not allow manual input beyond maxStock", async () => {
    const user = userEvent.setup();

    render(<QuantitySelector maxStock={5} />);

    const input = screen.getByRole("spinbutton");

    await user.clear(input);
    await user.type(input, "10");

    // Trigger blur to validate the input
    await user.tab();

    // Should be clamped to maxStock
    expect(input).toHaveValue(5);
  });

  it("should handle maxStock of 1", async () => {
    const user = userEvent.setup();

    render(<QuantitySelector maxStock={1} />);

    const increaseButton = screen.getByRole("button", { name: /increase/i });
    const input = screen.getByRole("spinbutton");

    // Try to increase
    await user.click(increaseButton);

    expect(input).toHaveValue(1);
  });
});
