import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Menu Item Review");
            expect(screen.queryByTestId("MenuItemReviewForm-itemID")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).reply(200, {
                id: 17,
                itemID: 1,
                reviewerEmail: "yessir@ucsb.edu",
                stars: 5,
                comments: "awesome",
                dateReviewed: "2024-05-12T02:59:10.233"
            });
            axiosMock.onPut('/api/menuitemreview').reply(200, {
                id: "17",
                itemID: '10',
                reviewerEmail: 'no@ucsb.edu',
                stars: '1',
                comments: 'sucks',
                dateReviewed: "2024-05-12T02:59:10.234"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-itemID");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIDField = screen.getByTestId("MenuItemReviewForm-itemID");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toHaveValue("17");
            expect(itemIDField).toHaveValue("1");
            expect(reviewerEmailField).toHaveValue("yessir@ucsb.edu");
            expect(starsField).toHaveValue("5");
            expect(commentsField).toHaveValue("awesome");
            expect(dateReviewedField).toHaveValue("2024-05-12T02:59:10.233")
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-itemID");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIDField = screen.getByTestId("MenuItemReviewForm-itemID");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toHaveValue("17");
            expect(itemIDField).toHaveValue("1");
            expect(reviewerEmailField).toHaveValue("yessir@ucsb.edu");
            expect(starsField).toHaveValue("5");
            expect(commentsField).toHaveValue("awesome");
            expect(dateReviewedField).toHaveValue("2024-05-12T02:59:10.233")

            expect(submitButton).toBeInTheDocument();
            
            fireEvent.change(itemIDField, { target: { value: '10' } })
            fireEvent.change(reviewerEmailField, { target: { value: 'no@ucsb.edu' } })
            fireEvent.change(starsField, { target: { value: '1' } })
            fireEvent.change(commentsField, { target: { value: 'sucks' } })
            fireEvent.change(dateReviewedField, { target: { value: "2024-05-12T02:59:10.234" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Menu Item Review Updated - id: 17 Reviewer Email: no@ucsb.edu");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemID: '10',
                reviewerEmail: 'no@ucsb.edu',
                comments: 'sucks',
                stars: '1',
                dateReviewed: "2024-05-12T02:59:10.234"
            })); // posted object

        });

       
    });
});


