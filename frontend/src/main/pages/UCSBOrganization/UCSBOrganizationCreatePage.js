
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationCreatePage({storybook=false}) {

  const objectToAxiosParams = (ucsborganization) => ({
    url: "/api/UCSBOrganization/post",
    method: "POST",
    params: {
      orgCode: ucsborganization.orgCode,
      orgTranslationShort: ucsborganization.orgTranslationShort,
      orgTranslation: ucsborganization.orgTranslation,
      inactive: ucsborganization.inactive
    }
  });

  const onSuccess = (ucsborganization) => {
    toast(`New UCSB Organization Created - orgCode: ${ucsborganization.orgCode}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
      { onSuccess }, 
      // Stryker disable next-line all : hard to set up test for caching
      ["/api/UCSBOrganization/all"] // mutation makes this key stale so that pages relying on it reload
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganization" />
  }

  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSB Organization</h1>
        <UCSBOrganizationForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
