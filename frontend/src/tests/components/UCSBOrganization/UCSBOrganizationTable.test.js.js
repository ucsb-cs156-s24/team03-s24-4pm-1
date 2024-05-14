
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationTable tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["orgCode", "OrgTranslationShort", "OrgTranslation", "Inactive"];
    const expectedFields = ["orgCode", "orgTranslationShort", "orgTranslation", "inactive"];
    const testId = "UCSBOrganizationTable";
    
    test("renders empty table correctly", () => {

        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationTable ucsborganization={[]} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(fieldElement).not.toBeInTheDocument();
        });
    });

    test("Has the expected column headers, content and buttons for admin user", () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationTable ucsborganization={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    
        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgCode);
        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgTranslationShort);
        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgTranslation);
        expect(screen.getByTestId(`${testId}-cell-row-0-col-inactive`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].inactive);

        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[1].orgCode);
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslationShort`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[1].orgTranslationShort);
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslation`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[1].orgTranslation);
        expect(screen.getByTestId(`${testId}-cell-row-1-col-inactive`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[1].inactive);

        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");
    });

    test("Has the expected column headers, content for ordinary user", () => {
        // arrange
        const currentUser = currentUserFixtures.userOnly;
    
        // act - render the component
        render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <UCSBOrganizationTable ucsborganization={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
            </MemoryRouter>
        </QueryClientProvider>
        );

        // assert
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgCode);
        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgTranslationShort);
        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgTranslation);
        expect(screen.getByTestId(`${testId}-cell-row-0-col-inactive`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].inactive);

        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[1].orgCode);
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslationShort`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[1].orgTranslationShort);
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslation`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[1].orgTranslation);
        expect(screen.getByTestId(`${testId}-cell-row-1-col-inactive`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[1].inactive);

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    test("Edit button navigates to the edit page", async () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;
    
        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    {/* <RestaurantTable restaurants={restaurantFixtures.threeRestaurants} currentUser={currentUser} /> */}
                    <UCSBOrganizationTable ucsborganization={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    
        // assert - check that the expected content is rendered
        expect(await screen.findByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgCode);
        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgTranslationShort);

        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();

        // act - click the edit button
        fireEvent.click(editButton);

        // assert - check that the navigate function was called with the expected path
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/ucsborganization/edit/' + ucsbOrganizationFixtures.threeOrganizations[0].orgCode));

    });

    test("Delete button calls delete callback", async () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;
    
        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationTable ucsborganization={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert - check that the expected content is rendered
        expect(await screen.findByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgCode);
        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgTranslationShort);

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act - click the delete button
        fireEvent.click(deleteButton);
    });
});
