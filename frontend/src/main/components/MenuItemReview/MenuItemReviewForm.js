import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    const testIdPrefix = "MenuItemReviewForm";

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    const num_regex = /^\d+$/;

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid={testIdPrefix + "-id"}
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="itemID">Menu Item ID</Form.Label>
                            <Form.Control
                                data-testid={testIdPrefix + "-itemID"}
                                id="itemID"
                                type="text"
                                isInvalid={Boolean(errors.itemID)}
                                {...register("itemID", {
                                    required: "itemID is required.",
                                    pattern: num_regex
                                })}
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.itemID?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="reviewerEmail">Reviewer Email</Form.Label>
                            <Form.Control
                                data-testid={testIdPrefix + "-reviewerEmail"}
                                id="reviewerEmail"
                                type="text"
                                isInvalid={Boolean(errors.reviewerEmail)}
                                {...register("reviewerEmail", {
                                    required: "Reviewer Email is required.",
                                })}
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.reviewerEmail?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            
            
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="stars">Stars</Form.Label>
                            <Form.Control
                                data-testid={testIdPrefix + "-stars"}
                                id="stars"
                                type="text"
                                isInvalid={Boolean(errors.stars)}
                                {...register("stars", {
                                    required: "Stars are required.",
                                    pattern: num_regex,
                                    min: {value: 0, message: "Minimum rating is 0 stars"},
                                    max: {value: 5, message: "Maximum rating is 5 stars"}
                                })}
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.stars?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                </Row>
                <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="comments">Comments</Form.Label>
                            <Form.Control
                                data-testid={testIdPrefix + "-comments"}
                                id="comments"
                                type="text"
                                isInvalid={Boolean(errors.comments)}
                                {...register("comments", {
                                    required: "Comments are required."
                                })}
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.comments?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateReviewed">Date (iso format)</Form.Label>
                            <Form.Control
                                data-testid={testIdPrefix + "-dateReviewed"}
                                id="dateReviewed"
                                type="text"
                                isInvalid={Boolean(errors.dateReviewed)}
                                {...register("dateReviewed", { required: true, pattern: isodate_regex})}
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.dateReviewed && 'Date is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            </Row>
            

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid={testIdPrefix + "-submit"}
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid={testIdPrefix + "-cancel"}
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default MenuItemReviewForm;



