import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function UCSBOrganizationForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
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

    // testIdPrefix
    const testIdPrefix = "UCSBOrganizationForm";

// String orgCode
// String orgTranslationShort
// String orgTranslation
// boolean inactive

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="orgCode">orgCode</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-orgCode"}
                            id="orgCode"
                            type="text"
                            isInvalid={Boolean(errors.orgCode)}
                            {...register("orgCode", { 
                                required: "OrgCode is required.",
                                maxLength: {
                                    value: 10,
                                    message: "Max length 10 characters"
                                }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.orgCode?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="orgTranslationShort">orgTranslationShort</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-orgTranslationShort"}
                            id="orgTranslationShort"
                            type="text"
                            isInvalid={Boolean(errors.orgTranslationShort)}
                            {...register("orgTranslationShort", { 
                                required: "OrgTranslationShort is required.",
                                maxLength: {
                                    value: 20,
                                    message: "Max length 20 characters"
                                }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.orgTranslationShort?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="orgTranslation">orgTranslation</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-orgTranslation"}
                        id="orgTranslation"
                        type="text"
                        isInvalid={Boolean(errors.orgTranslation)}
                        {...register("orgTranslation", { 
                            required: "OrgTranslation is required." 
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.orgTranslation?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="inactive">inactive</Form.Label>
                    <Form.Select
                        data-testid={testIdPrefix + "-inactive"}
                        id="inactive"
                        {...register("inactive")}
                    >
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </Form.Select>
                </Form.Group>
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
    );
}

export default UCSBOrganizationForm;