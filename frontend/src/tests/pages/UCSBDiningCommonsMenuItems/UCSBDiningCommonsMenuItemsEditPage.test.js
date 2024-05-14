import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";

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

describe("UCSBDiningCommonsMenuItemsEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbdiningcommonsmenuitems", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBDiningCommonsMenuItems");
            expect(screen.queryByTestId("UCSBDiningCommonsMenuItems-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/ucsbdiningcommonsmenuitems", { params: { id: 17 } }).reply(200, {
                id: 17,
                diningCommonsCode: "Ortega",
                name: "Classic Burger",
                station: "Entrees"
            });
            axiosMock.onPut('/api/ucsbdiningcommonsmenuitems').reply(200, {
                id: 17,
                diningCommonsCode: "Ortega",
                name: "Classic Burger",
                station: "Entrees"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-id");

            const idField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-id");
            const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
            const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
            const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
            const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(diningCommonsCodeField).toBeInTheDocument();
            expect(diningCommonsCodeField).toHaveValue("Ortega");
            expect(nameField).toBeInTheDocument();
            expect(nameField).toHaveValue("Classic Burger");
            expect(stationField).toBeInTheDocument();
            expect(stationField).toHaveValue("Entrees");
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toHaveTextContent("Update");
            
            fireEvent.change(nameField, { target: { value: 'Classic Burger' } });
            fireEvent.change(stationField, { target: { value: 'Entrees' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBDiningCommonsMenuItems Updated - id: 17 name: Classic Burger");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbdiningcommonsmenuitems" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                diningCommonsCode: 'Ortega',
                name: 'Classic Burger',
                station: 'Entrees'
            })); // posted object
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-id");

            const idField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-id");
            const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
            const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
            const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
            const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

            expect(idField).toHaveValue("17");
            expect(diningCommonsCodeField).toHaveValue("Ortega");
            expect(nameField).toHaveValue("Classic Burger");
            expect(stationField).toHaveValue("Entrees");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(diningCommonsCodeField, { target: { value: 'Carrillo' } })
            fireEvent.change(nameField, { target: { value: 'Pork Chow Mein' } })
            fireEvent.change(stationField, { target: { value: 'Mongolian Grill' } })

            fireEvent.click(submitButton);
            expect(nameField).toHaveValue("Pork Chow Mein");
            await waitFor(() => expect(mockToast).toBeCalled());
            //expect(mockToast).toBeCalledWith("UCSBDiningCommonsMenuItems Updated - id: 17 name: Pork Chow Mein");
            expect(mockToast).toBeCalledWith("UCSBDiningCommonsMenuItems Updated - id: 17 name: Classic Burger")
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbdiningcommonsmenuitems" });
            
            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                diningCommonsCode: 'Carrillo',
                name: "Pork Chow Mein",
                station: "Mongolian Grill"
            }));
            
        });

       
    });
});
