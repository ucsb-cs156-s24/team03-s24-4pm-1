import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const menuItemReview = {
            id: 1,
            itemID: 1,
            reviewerEmail: "yessir@ucsb.edu",
            stars: 5,
            comments: "awesome",
            dateReviewed: "2024-05-12T02:59:10.233"
        };

        axiosMock.onPost("/api/menuitemreview/post").reply( 202, menuItemReview );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("MenuItemReviewForm-itemID")).toBeInTheDocument();
        });

        const itemIDField = screen.getByTestId("MenuItemReviewForm-itemID");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIDField, { target: { value: 1 } });
        fireEvent.change(reviewerEmailField, { target: { value: 'yessir@ucsb.edu' } });
        fireEvent.change(starsField, { target: { value: 5 } });
        fireEvent.change(commentsField, { target: { value: 'awesome' } });
        fireEvent.change(dateReviewedField, { target: { value: '2024-05-12T02:59:10.233' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "itemID": "1",
            "reviewerEmail": "yessir@ucsb.edu",
            "stars": "5",
            "comments": "awesome",
            "dateReviewed": "2024-05-12T02:59:10.233"
        });

        expect(mockToast).toBeCalledWith(`New Menu Item Review Created - id: 1 Reviewer Email: yessir@ucsb.edu`);
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });
    });


});


