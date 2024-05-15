import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("MenuItemReviewForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a MenuItemReview", async () => {

        render(
            <Router  >
                <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneReview} />
            </Router>
        );
        await screen.findByTestId(/MenuItemReviewForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/MenuItemReviewForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemID");
        const itemIDField = screen.getByTestId("MenuItemReviewForm-itemID");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIDField, { target: { value: 'bad-input' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(starsField, { target: { value: 'bad-input' } });
        fireEvent.change(commentsField, { target: { value: 'bad-input' } });
        fireEvent.change(dateReviewedField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/itemID is required./);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-submit");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/itemID is required./);
        expect(screen.getByText(/Reviewer Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Stars are required./)).toBeInTheDocument();
        expect(screen.getByText(/Comments are required./)).toBeInTheDocument();
        expect(screen.getByText(/Date is required./)).toBeInTheDocument();


    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <MenuItemReviewForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemID");

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
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Date must be in ISO format./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-cancel");
        const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


