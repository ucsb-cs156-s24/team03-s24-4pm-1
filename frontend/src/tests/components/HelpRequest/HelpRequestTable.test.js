import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import HelpRequestTable from "main/components/HelpRequest/HelpRequestTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("HelpRequestTable tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["id", "Requester Email", "Team ID", "Table or Breakout Room", "Request Time", "Explanation", "Solved"];
    const expectedFields = ["id", "requesterEmail", "teamId", "tableOrBreakoutRoom", "requestTime", "explanation", "solved"];
    const testId = "HelpRequestTable";

  test("Has the expected column headers and content for ordinary user", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable helpRequests={helpRequestFixtures.threeHelpRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });
  
      expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
      });
  
      expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
  
      const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
      expect(editButton).not.toBeInTheDocument();
  
      const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
      expect(deleteButton).not.toBeInTheDocument();

  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable helpRequests={helpRequestFixtures.threeHelpRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });
  
      expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
      });
  
      expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
  
      const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass("btn-primary");
  
      const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable helpRequests={helpRequestFixtures.threeHelpRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(screen.getByTestId(`HelpRequestTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

    const editButton = screen.getByTestId(`HelpRequestTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/helprequest/edit/1'));

  });

  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            <HelpRequestTable helpRequests={helpRequestFixtures.threeHelpRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);
  });

  test("Renders empty table correctly", () => {
    
    const currentUser = currentUserFixtures.currentUser;

        render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <HelpRequestTable helpRequests={[]} currentUser={currentUser} />
            </MemoryRouter>
            </QueryClientProvider>
    
        );
  
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).not.toBeInTheDocument();
        });
    });

    
});

