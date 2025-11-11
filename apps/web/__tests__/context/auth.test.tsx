import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../app/context/auth";

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("useAuth hook", () => {
    it("should throw error when used outside AuthProvider", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within AuthProvider");

      consoleSpy.mockRestore();
    });

    it("should provide initial values", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(typeof result.current.login).toBe("function");
      expect(typeof result.current.register).toBe("function");
      expect(typeof result.current.logout).toBe("function");
    });
  });

  describe("login", () => {
    it("should successfully login and store JWT", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };

      const mockResponse = {
        jwt: "mock-jwt-token",
        user: mockUser,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.login("test@example.com", "password123");
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "jwt",
        "mock-jwt-token"
      );
      expect(result.current.user).toEqual(mockUser);
    });

    it("should handle login failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await expect(
        result.current.login("test@example.com", "wrongpassword")
      ).rejects.toThrow("Login failed");
    });
  });

  describe("register", () => {
    it("should successfully register a new user", async () => {
      const mockUser = {
        id: 1,
        username: "newuser",
        email: "new@example.com",
      };

      const mockResponse = {
        jwt: "new-jwt-token",
        user: mockUser,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.register(
          "newuser",
          "new@example.com",
          "password123"
        );
      });

      expect(localStorage.setItem).toHaveBeenCalledWith("jwt", "new-jwt-token");
      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe("logout", () => {
    it("should clear user and remove JWT from localStorage", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };

      const mockResponse = {
        jwt: "mock-jwt-token",
        user: mockUser,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // login first
      await act(async () => {
        await result.current.login("test@example.com", "password123");
      });

      // then logout
      act(() => {
        result.current.logout();
      });

      expect(localStorage.removeItem).toHaveBeenCalledWith("jwt");
      expect(result.current.user).toBeNull();
    });
  });

  describe("token persistence", () => {
    it("should fetch user on mount if JWT exists", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };

      (localStorage.getItem as jest.Mock).mockReturnValue("existing-jwt-token");

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
