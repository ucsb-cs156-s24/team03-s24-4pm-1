import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("ArticlesForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Title", "Url", "Explanation", "Email", "Date Added"];
    const testId = "ArticlesForm";
    test("renders correctly with no initial contents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    });


    test("renders correctly when passing in a Article", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <Router  >
                    <ArticlesForm initialContents={articlesFixtures.oneArticle} />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(/ArticlesForm-id/)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
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
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Title is required./);
        expect(screen.getByText(/Url is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/DateAdded is required./)).toBeInTheDocument();

        const titleInput = screen.getByTestId(`${testId}-title`);
        fireEvent.change(titleInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
        });

        const urlInput = screen.getByTestId(`${testId}-url`);
        fireEvent.change(urlInput, { target: { value: "a".repeat(101) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 100 characters/)).toBeInTheDocument();
        });

        const explanationInput = screen.getByTestId(`${testId}-explanation`);
        fireEvent.change(explanationInput, { target: { value: "a".repeat(0) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        });

        const emailInput = screen.getByTestId(`${testId}-email`);
        fireEvent.change(emailInput, { target: { value: "a".repeat(0) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Email is required./)).toBeInTheDocument();
        });
    });

});