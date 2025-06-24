export const FetchDoctors = async (employeeHash: string) => {
  if (!employeeHash) {
    console.log("FetchDoctors error: Employee hash is empty or undefined");
    return {
      success: false,
      message: "Employee code cannot be empty or undefined.",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROJECT_URL}/employee/${employeeHash}/contact/list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({}),
      },
    );

    if (!response.ok) {
      console.log(
        "FetchDoctors error: Failed to fetch doctors. Status:",
        response.status,
      );
      return {
        success: false,
        message: "Failed to fetch doctors.",
      };
    }
    const result = await response.json();
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.log("FetchDoctors exception:", error);

    return {
      success: false,
      message: "Failed to fetch doctors.",
    };
  }
};
