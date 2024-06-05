package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_menuItemReview() throws Exception {
        setupUser(true);

        page.getByText("Menu Item Review").click();

        page.getByText("Create Menu Item Review").click();
        assertThat(page.getByText("Create New Menu Item Review")).isVisible();
        page.getByTestId("MenuItemReviewForm-itemID").fill("5");
        page.getByTestId("MenuItemReviewForm-reviewerEmail").fill("temp@gmail.com");
        page.getByTestId("MenuItemReviewForm-stars").fill("5");
        page.getByTestId("MenuItemReviewForm-comments").fill("great");
        page.getByTestId("MenuItemReviewForm-dateReviewed").fill("2022-03-11T00:00:00");

        page.getByTestId("MenuItemReviewForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemID"))
                .hasText("5");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Menu Item Review")).isVisible();
        page.getByTestId("MenuItemReviewForm-reviewerEmail").fill("no@gmail.com");
        page.getByTestId("MenuItemReviewForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail")).hasText("no@gmail.com");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemID")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_menuItemReview() throws Exception {
        setupUser(false);

        page.getByText("Menu Item Review").click();

        assertThat(page.getByText("Create Menu Item Review")).not().isVisible();
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-name")).not().isVisible();
    }
}