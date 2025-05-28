const config = (projectInfo) => {
  return {
    theme: {
      selectedBg: "bg-gradient-to-br from-red-600 to-red-900",
      unselectedBg: "bg-transparent",
      selectedText: "text-white",
      unselectedText: "text-red-100",
      selectedGradient: "bg-gradient-to-br from-red-600 to-red-900",
      selectedDot: "bg-red-600",
      unselectedBorder: "border-red-100",
      dotBorder: "border-white",
    },
    basic: {
      primaryText: "#ffffff",
      primaryColor: "#fb2c36",
      secondaryColor: "#f5ba01",
      secondaryText: "#ffffff",
    },
    loginPage: {
      heading: "Welcome Back",
      subHeading: "Sign in to manage your cinema ads",
      loginLabel: "Cinema Access Code",
      loginButtomLabel: "Sign In",
      passwordLabel: "Password",
      mobileLabel: "Mobile Number",
    },
    Dashboard: {
      HomePageTitle: "Cinema Ad Management",
      HomePageSubTitle: "Manage all your cinema advertisements from here",
      HomePageButtonLabel: "Add New Doctor",
      title: "Dashboard Overview",
      ActiveLabel: "Active Clients",
      PendingLabel: "Pending Approvals",
    },
    ApprovalPageTitle:{
      HomePageTitle: "Cinema Ad Approvals",
    }
  };
};

export default config;
