export default function Footer() {
    return (
      <footer className="fixed bottom-0 w-full bg-gray-900 text-white text-center py-4">
        <div className="flex justify-center space-x-4">
          <a href="/faqs" className="hover:underline">FAQs</a>
          <a href="/help-center" className="hover:underline">Help Center</a>
          <a href="/report-issue" className="hover:underline">Report an Issue</a>
        </div>
        <p className="mt-2">© 2025 Flick. All Rights Reserved.</p>
      </footer>
    );
  }
  