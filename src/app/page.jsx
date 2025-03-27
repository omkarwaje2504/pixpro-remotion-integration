import DoctorForm from './DoctorForm'
import LoginPage from './LoginPage'

export async function generateStaticParams() {
  try {

    console.log("Generating static paths for home page ...");
    const response = await fetch('http://localhost:3000/api/hello')

    if (!response.ok) {
      throw new Error(`Failed to fetch static paths: ${response.statusText}`);
    }

    const pathnames = await response.json();
    return pathnames.map((path) => ({ pathname: path }));
  } catch (error) {
    console.error(error);
    return [];
  }
}


export default async function Home({ params }) {
  const { pathname } = params;

  try {
    const projectInfo = {
      "id": "k4qw1jng",
      "name": "Bigiviz",
      "company": "ABC",
      "deliverable": "e-video",
      "contact_label": "Doctors",
      "product_name": "video",
      "product_type": "video",
      "contacts_limit": 3500,
      "employees_count": 0,
      "contacts_count": 0,
      "downloads_count": 0,
      "ready_videos_count": 0,
      "created_at": "10/03/2025 07:14 PM",
      "closed_at": null,
      "texts": {
        "login_button": "Login",
        "check_employee_login": "Check Employee",
        "save_and_next_ecard_button": "Save & Next",
        "save_and_next_calendar_button": "Save & Next",
        "save_and_add_new_button": "Save & Add New",
        "save_and_next_button": "Save & Next",
        "contact_label": "Doctor",
        "contact_name_label": "Doctor Full Name",
        "contact_name_placeholder": "e.g. Dr. Mohit Singh",
        "contact_name_hint": "Please enter doctor full name with proper spelling",
        "contact_state_label": "Please select the state",
        "contact_state_error_message": "Please select the state",
        "contact_city_label": "Please select the city",
        "contact_city_error_message": "Please select the city",
        "contact_state_hint": "eg. Maharashtra",
        "contact_city_hint": "eg. Mumbai",
        "contact_mobile_label": "Doctor Mobile",
        "contact_mobile_placeholder": "e.g. 8899998899",
        "contact_mobile_hint": "Please enter doctor mobile number, this field is used as unique identification",
        "contact_birthday_label": "Doctor Birthday",
        "contact_anniversary_label": "Doctor Anniversary",
        "employee_password_label": "Password",
        "employee_password_placeholder": "e.g. *****",
        "employee_password_hint": "Enter password to proceed",
        "enter_employee_code_label": "Enter Employee Code",
        "employee_code": "Code",
        "employee_code_placeholder": "e.g. E-123456",
        "employee_code_hint": "Please enter employee code",
        "employee_mobile": "Employee Mobile",
        "employee_mobile_placeholder": "e.g. 8899998899",
        "employee_mobile_hint": "Please enter employee mobile number",
        "employee_name": "Name",
        "employee_hq": "Employee HQ",
        "employee_region": "Employee Region",
        "employee_code_to_proceed_error": "Enter employee code to proceed",
        "employee_code_or_mobile_to_proceed_error": "Enter employee code or mobile to proceed",
        "doctor_form_select_language": "Select Language",
        "contact_photo_upload": "Contact Photo Upload",
        "contact_photo_upload_button": "Choose Photo from Gallery or Click Live Photo",
        "contacts_limit_reached": "Contacts limit reached!",
        "upload_photo_min_1_mb": "Please upload photo of min size 1 MB",
        "upload_photo_min_2_mb": "Please upload photo of min size 2 MB",
        "download_ecard_button": "Download E-Card",
        "preparing_high_quality_image_download": "Preparing High Quality Image for Download",
        "min_mobile_digits_validation": "10",
        "max_mobile_digits_validation": "10",
        "mobile_starts_with_validation": "5,6,7,8,9",
        "error_message_min_mobile_digits_validation": "Please submit 10 digit valid mobile number",
        "error_message_max_mobile_digits_validation": "Please submit 10 digit valid mobile number",
        "error_message_mobile_starts_with_validation": "Please submit 10 digit valid mobile number",
        "photo_uploading_consent_checkbox_message": "I hereby agree to Terms & Conditions and confirm that doctor has given consent to the photo uploading for printing purpose",
        "photo_uploading_consent_checkbox_error": "Please confirm that doctor has given consent to the photo uploading for printing purpose",
        "photo_uploading_consent_popup_title": "Terms & Conditions",
        "photo_uploading_consent_popup_message": "<p>I hereby confirm that doctor has given consent to the photo uploading for printing purpose</p>",
        "photo_uploading_consent_popup_agree_button_message": "Accept",
        "calendar_ready_message": "Cropping completed, you can proceed with next doctor",
        "ecard_add_new_button": "Add New Doctor",
        "print_initiated_cannot_update": "Print initiated, cannot update!",
        "add_new_button": "Add New Doctor",
        "save_and_next_video_button": "Save & Proceed",
        "download_video_button": "Download Video",
        "crop_your_photos_to_see_the_preview": "Crop your photo to see the preview",
        "doctor_form_select_deliverable": "Select Deliverable",
        "contact_email_label": "Doctor Email",
        "contact_email_placeholder": "e.g. hello@gmail.com",
        "contact_email_hint": "Please enter valid doctor email",
        "download_qr_button": "Download QR",
        "form_saved_title": "Great!",
        "form_saved_successfully": "Details saved, add another doctor!",
        "ecard_video_preview_saved_title": "Great!",
        "ecard_video_preview_saved_successfully": "Details saved, please crop photo on next step!",
        "calendar_details_saved_successfully": "Details saved, please crop photo on next step!",
        "doctor_list_heading_title": "Doctor List",
        "project_heading": "Project",
        "project_sub_heading": "Project Sub Heading",
        "get_started_button": "Get Started",
        "login_heading": "Login",
        "login_sub_heading": "Login Sub Heading",
        "win_section_title": "Win",
        "lost_section_title": "Lost",
        "spin_prize_accept_button": "Accept Prize",
        "spin_prize_reject_button": "Reject Prize",
        "contact_country_code_label": "Country Code",
        "save_button": "Save",
        "duplicate_mobile_no_error_title": "Sorry",
        "duplicate_mobile_no_error_msg": "Mobile No Is Repeated",
        "preview_audio_text": "Preview Audio",
        "ai_script": "Ai Script"
      },
      "company_logo": "",
      "deliverable_limit": 3500,
      "employees_with_contact": 142,
      "contacts_today": 72,
      "contacts_yesterday": 134,
      "employees_today": 30,
      "employees_yesterday": 47,
      "cropperFields": [],
      "top_banner": "",
      "bottom_banner": "",
      "logo": "",
      "features": [
        "default_employee"
      ],
      "fields": {
        "speciality": {
          "id": "n1l0de8z23",
          "name": "speciality",
          "label": "speciality",
          "type": "text",
          "placeholder": null,
          "hint": null,
          "options": null,
          "default": null,
          "validations": {
            "required": true,
            "min": null,
            "max": null,
            "max_lines": null,
            "max_per_line": null
          },
          "config": {
            "hide_csv": false,
            "hide_pdf": false,
            "edit_not_allowed": null,
            "not_equal_to_mobile": null,
            "backstage_only": null,
            "title_case": null,
            "backstage_optional": false
          },
          "helper": null
        }
      },
      "last_contact_at": "26/03/2025 05:27 PM",
      "web_link": "",
      "settings": {
        "landing_page": "simple-form",
        "form_title": "Personalized Doctor's Photo Frame Submission",
        "token": "b9e4f961-426b-4984-8669-1d38560699cb",
        "external_domain": "",
        "password": null,
        "report_column": "hq",
        "approval_stage": null,
        "primaryColor": null,
        "secondaryColor": null,
        "textColor": null,
        "ascentColor": null,
        "backgroundColor": null,
        "customCSS": null
      },
      "seo":{
        "seo_title": "AI-Enhanced Personalized Photo Frames for Doctors – Unique Oil Paint Effect",
      "seo_description": "Create AI-powered oil painting photo frames for doctors. MRs can log in to submit and update doctor details for a unique, personalized framed artwork."
      }
    };
     console.log("data", projectInfo.features);

    if (projectInfo?.features?.includes("default_employee")) {
      console.log("form");
      return <DoctorForm projectInfo={projectInfo} />;
    } else {
      console.log("login");
      return <LoginPage projectInfo={projectInfo} />;
    }
  } catch (error) {
    console.error(error);
    return <div className="text-white">Error loading the page.</div>;
  }
}
