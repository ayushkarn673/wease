import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, IndianRupee, Star, PenTool, CheckCircle, MapPin } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import { Button } from "@/components/ui/Button";
import { createWorkerProfile } from "../../services/workerService";

const serviceMapping = {
  "Carpenter": "CARPENTER",
  "Painter": "PAINTER",
  "Electrician": "ELECTRICIAN",
  "Plumber": "PLUMBER",
  "Cleaner": "CLEANER",
  "Mason": "MASON",
  "AC Repair": "AC_TECHNICIAN",
  "Labour": "LABOURER",
};

export default function CompleteWorkerProfile() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const services = [
    "Carpenter",
    "Painter",
    "Electrician",
    "Plumber",
    "Cleaner",
    "Mason",
    "AC Repair",
    "Labour",
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.log("Error obtaining location: ", error);
          // Default to Pune coordinates
          setLatitude(18.5204);
          setLongitude(73.8567);
        }
      );
    } else {
      // Default to Pune coordinates
      setLatitude(18.5204);
      setLongitude(73.8567);
    }
  }, []);

  const handleNextStep = async () => {
    const newErrors = {};

    if (step === 1) {
      if (!service) newErrors.service = "Please select a service category";
      if (!price || isNaN(price) || Number(price) <= 0) {
        newErrors.price = "Please enter a valid visit rate";
      }
      if (!experience || isNaN(experience) || Number(experience) < 0) {
        newErrors.experience = "Please enter your experience in years";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!bio || bio.length < 20) {
        newErrors.bio = "Please write a bio (minimum 20 characters)";
      }
      if (!skills) newErrors.skills = "Please list a few key skills";
      if (!address) newErrors.address = "Please enter your service address";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      try {
        const professionEnum = serviceMapping[service];
        await createWorkerProfile({
          profession: professionEnum,
          experience: parseInt(experience),
          bio: `${bio} | Skills: ${skills}`,
          hourlyRate: parseFloat(price),
          address,
          latitude: latitude || 18.5204,
          longitude: longitude || 73.8567,
        });

        setStep(3);
      } catch (error) {
        console.error("Error creating worker profile: ", error);
        const data = error.response?.data;
        if (data?.message) {
          setErrors({ server: data.message });
        } else {
          setErrors({ server: "Failed to save profile. Make sure the backend is running." });
        }
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (step === 3) {
      navigate("/worker/dashboard");
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        {/* Step Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                step >= num
                  ? "bg-blue-600 dark:bg-blue-500"
                  : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Profile Setup
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-455">
                Let's configure your basic service info.
              </p>
            </div>

            <div className="space-y-6">
              {/* Category dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Service Category
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="h-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-sm font-semibold text-slate-700 dark:text-slate-350 focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="">Select Service Category</option>
                  {services.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <span className="text-xs text-red-500 font-semibold mt-0.5">
                    {errors.service}
                  </span>
                )}
              </div>

              {/* Price rate */}
              <AuthInput
                label="Starting Visit Rate (₹)"
                type="text"
                placeholder="499"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                Icon={IndianRupee}
                error={errors.price}
              />

              {/* Experience */}
              <AuthInput
                label="Years of Experience"
                type="text"
                placeholder="5"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                Icon={Briefcase}
                error={errors.experience}
              />

              <Button
                onClick={handleNextStep}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold mt-4"
              >
                Continue
              </Button>
            </div>
          </div>
        )}        {step === 2 && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Bio, Address & Skills
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-555 dark:text-slate-455">
                Describe your expertise and service location.
              </p>
            </div>

            <div className="space-y-6">
              {errors.server && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                  <span className="text-red-500 mt-0.5">⚠</span>
                  <p className="text-sm text-red-600 dark:text-red-400 font-semibold">{errors.server}</p>
                </div>
              )}

              {/* Short Bio */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Short Bio / Description
                </label>
                <textarea
                  placeholder="I am a professional painter with over 5 years of experience specializing in interior walls..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="h-28 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 transition resize-none leading-relaxed"
                />
                {errors.bio && (
                  <span className="text-xs text-red-500 font-semibold mt-0.5">
                    {errors.bio}
                  </span>
                )}
              </div>

              {/* Address input */}
              <AuthInput
                label="Service Address"
                type="text"
                placeholder="Pune, Maharashtra"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                Icon={MapPin}
                error={errors.address}
              />

              {/* Skills input */}
              <AuthInput
                label="Key Skills (comma separated)"
                type="text"
                placeholder="Wall painting, Texture Art, Wood polish"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                Icon={PenTool}
                error={errors.skills}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  disabled={isSubmitting}
                  className="flex-1 h-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-300 font-bold"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold"
                >
                  {isSubmitting ? "Saving..." : "Submit Profile"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-green-500/10">
              <CheckCircle size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Profile completed!
            </h2>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-455 leading-relaxed">
              Your professional profile is set up. You can now accept incoming jobs on your dashboard.
            </p>
            <Button
              onClick={handleNextStep}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold mt-8"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
