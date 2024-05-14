
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query"

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = [
        "orgCode",
        "OrgTranslationShort",
        "OrgTranslation",
        "Inactive"
    ];
    const testId = "UCSBOrganizationForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
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
                    <UCSBOrganizationForm initialContents={ucsbOrganizationFixtures.oneOrganization[0]} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
        expect(screen.getByText(`orgCode`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-orgCode`)).toHaveValue("TT");

        expect(await screen.findByTestId(`${testId}-orgTranslationShort`)).toBeInTheDocument();
        expect(screen.getByText(`OrgTranslationShort`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-orgTranslationShort`)).toHaveValue("Theta Tau");

        expect(await screen.findByTestId(`${testId}-orgTranslation`)).toBeInTheDocument();
        expect(screen.getByText(`OrgTranslation`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-orgTranslation`)).toHaveValue("Theta Tau");

        expect(await screen.findByTestId(`${testId}-inactive`)).toBeInTheDocument();
        expect(screen.getByText(`Inactive`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-inactive`)).toHaveValue("false");
    })

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
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
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId(`${testId}-submit`)).toBeInTheDocument();
        const submitButton = screen.getByTestId(`${testId}-submit`);
        fireEvent.click(submitButton);

        await screen.findByText(/OrgCode is required./);
        expect(screen.getByText(/OrgTranslationShort is required./)).toBeInTheDocument();
        expect(screen.getByText(/OrgTranslation is required./)).toBeInTheDocument();

        const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
        fireEvent.change(orgCodeInput, { target: { value: "a".repeat(11) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 10 characters/)).toBeInTheDocument();
        });

        const orgTranslationShortInput = screen.getByTestId(`${testId}-orgTranslationShort`);
        fireEvent.change(orgTranslationShortInput, { target: { value: "a".repeat(21) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 20 characters/)).toBeInTheDocument();
        });
    });
});
