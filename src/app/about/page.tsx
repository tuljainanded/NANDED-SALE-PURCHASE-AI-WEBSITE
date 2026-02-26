import { CheckCircle2, Star, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Nanded Sale Purchase</h1>
          <p className="text-xl max-w-2xl mx-auto text-red-100">
            The premium local digital marketplace designed specifically for the people of Nanded.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg text-gray-600">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-marathi">नांदेडकरांसाठी खास सुविधा!</h2>
            <p className="mb-6">
              Nanded Sale Purchase is a revolutionary platform that bridges the gap between buyers and sellers in Nanded and surrounding areas. Our mission is to make local trading as simple, transparent, and accessible as possible.
            </p>
            <p className="mb-10 text-xl font-medium text-gray-800 border-l-4 border-red-500 pl-4 py-2 bg-red-50">
              आता घरबसल्या तुमचं कुठलंही प्रॉडक्ट, प्रॉपर्टी, गाडी, फर्निचर, इलेक्ट्रॉनिक्स, शेतीसामान किंवा अन्य वस्तू विकायची किंवा घ्यायची असेल तर आमचं प्लॅटफॉर्म तुमच्यासाठीच आहे!
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Why Choose Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100">
                <Target className="h-10 w-10 text-red-500 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Local Focus</h4>
                <p className="text-sm">Dedicated entirely to Nanded, ensuring relevant and local reach.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100">
                <CheckCircle2 className="h-10 w-10 text-blue-500 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Verified Listings</h4>
                <p className="text-sm">Admin approved posts ensure high quality and genuine products.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100">
                <Star className="h-10 w-10 text-purple-500 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Social Reach</h4>
                <p className="text-sm">We don't just post on our website; we promote you on YouTube, Instagram, and Facebook.</p>
              </div>
            </div>

            <div className="bg-red-600 text-white p-8 rounded-2xl text-center shadow-lg transform transition-transform hover:scale-[1.02]">
              <h3 className="text-2xl font-bold mb-4">✅ संपूर्णपणे मोफत!</h3>
              <p className="mb-6">कोणतीही फी नाही – फक्त तुमची जाहिरात / पोस्ट / व्हिडीओ / प्रॉडक्ट डिटेल्स आम्हाला पाठवा, आम्ही ती मोफत प्रमोट करू!</p>
              <Link href="/post-ad">
                <Button variant="secondary" size="lg" className="rounded-full px-8 py-6 text-red-700 font-bold hover:bg-white/90">
                  Start Selling For Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
