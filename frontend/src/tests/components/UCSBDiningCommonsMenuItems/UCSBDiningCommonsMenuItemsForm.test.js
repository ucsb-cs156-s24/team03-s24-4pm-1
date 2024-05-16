import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBDiningCommonsMenuItemsForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsForm";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBDiningCommonsMenuItemsForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Dining Commons Code", "Name", "Station"];
    const testId = "UCSBDiningCommonsMenuItemsForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemsForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemsForm initialContents={ucsbDiningCommonsMenuItemsFixtures.oneItem} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemsForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemsForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        //const submitButton = screen.getByText(/Create/);
        const submitButton = screen.getByTestId(`${testId}-submit`);
        fireEvent.click(submitButton);

        await screen.findByText(/Dining Commons Code is required./);
        expect(screen.getByText(/Dining Commons Code is required./)).toBeInTheDocument();

        await screen.findByText(/Name is required/);
        expect(screen.getByText(/Name is required/)).toBeInTheDocument();

        await screen.findByText(/Station is required/);
        expect(screen.getByText(/Station is required/)).toBeInTheDocument();

        const diningCommonsCodeInput = screen.getByTestId(`${testId}-diningCommonsCode`);
        fireEvent.change(diningCommonsCodeInput, { target: { value: "a".repeat(256) } });
        fireEvent.click(submitButton);
        await screen.findByText(/Max length 255 characters/);
        expect(screen.getByText(/Max length 255 characters/)).toBeInTheDocument();
        fireEvent.change(diningCommonsCodeInput, { target: { value: "" } });
        fireEvent.click(submitButton);

        const nameInput = screen.getByTestId(`${testId}-name`);
        fireEvent.change(nameInput, { target: { value: "a".repeat(256) } });
        await screen.findByText(/Max length 255 characters/);
        expect(screen.getByText(/Max length 255 characters/)).toBeInTheDocument();
        fireEvent.change(nameInput, { target: { value: "" } });
        fireEvent.click(submitButton);

        const stationInput = screen.getByTestId(`${testId}-station`);
        fireEvent.change(stationInput, { target: { value: "a".repeat(256) } });
        await screen.findByText(/Max length 255 characters/);
        expect(screen.getByText(/Max length 255 characters/)).toBeInTheDocument();
    });

});