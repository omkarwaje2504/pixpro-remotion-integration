export const LoginSubmission = async (formData: any) => {
  console.log("LoginSubmission called with:", formData);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true); // Simulated successful login
    }, 4000);
  });
};
