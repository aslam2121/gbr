"use client";

import { useState } from "react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  id: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "General Questions",
    id: "generalFAQ",
    items: [
      {
        question: "What is Global Business Directory?",
        answer: "Global Business Directory (GBR) is a platform that connects companies seeking investment, investors looking for opportunities, and experts offering consultation services.",
      },
      {
        question: "How do I join GBR?",
        answer: 'Click "New Member" in the navigation, choose your account type, and complete the registration form.',
      },
      {
        question: "Is GBR free to use?",
        answer: "Yes. Basic membership is free. Premium features are available for enhanced networking and priority matching.",
      },
    ],
  },
  {
    title: "For Companies",
    id: "companyFAQ",
    items: [
      {
        question: "How can I attract investors to my company?",
        answer: "Build a complete profile with clear goals, traction, and funding needs, then use messaging and video chat to engage with investors.",
      },
      {
        question: "What should I include in my company profile?",
        answer: "Add your mission, offerings, market opportunity, team details, and funding requirements.",
      },
    ],
  },
  {
    title: "For Investors",
    id: "investorFAQ",
    items: [
      {
        question: "How do I find investment opportunities?",
        answer: "Use search and filters by industry, region, and stage to find opportunities aligned with your investment criteria.",
      },
      {
        question: "How do I verify company information?",
        answer: "Perform due diligence, request documents, schedule meetings, and consult domain experts through the platform.",
      },
    ],
  },
  {
    title: "Technical Support",
    id: "techFAQ",
    items: [
      {
        question: "I am having trouble logging in. What should I do?",
        answer: 'Use "Forgot Password" first. If the issue remains, contact support with your email and a short issue description.',
      },
      {
        question: "How do I update my profile information?",
        answer: "Go to profile settings after login and update your details. Save changes to keep your profile current.",
      },
    ],
  },
];

function AccordionSection({ section }: { section: FAQSection }) {
  const [openIndex, setOpenIndex] = useState<number | null>(section.id === "generalFAQ" ? 0 : null);

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">{section.title}</h2>
      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
        {section.items.map((item, i) => (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              {item.question}
              <i className={`bi ${openIndex === i ? "bi-chevron-up" : "bi-chevron-down"} text-gray-500`}></i>
            </button>
            {openIndex === i && (
              <div className="border-t border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-gray-900 lg:text-5xl">Frequently Asked Questions</h1>
            <p className="mt-4 text-lg text-gray-600">
              Find answers to common questions about Global Business Directory and how to make the most of our platform.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {faqSections.map((section) => (
            <AccordionSection key={section.id} section={section} />
          ))}

          {/* Still have questions */}
          <div className="mt-8 text-center">
            <div className="rounded-lg bg-gray-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900">Still have questions?</h2>
              <p className="mt-2 mb-4 text-sm text-gray-600">Can not find what you are looking for? Our support team is here to help.</p>
              <Link
                href="/contact"
                className="inline-block rounded-md px-6 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: "#0083ae" }}
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
