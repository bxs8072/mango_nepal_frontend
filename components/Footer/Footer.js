import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="content">
          <aside>
            <ul>
              <li>
                <Link href="/privacy_policy">
                  <a>Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/terms_and_conditions">
                  <a>Terms & Conditions</a>
                </Link>
              </li>
            </ul>
          </aside>
          <aside>&copy; 2020, MangoNepal™</aside>
          <aside>
            <ul>
              <li>
                <Link href="/about_us">
                  <a>About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/contact_us">
                  <a>Contact Us</a>
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </footer>
  );
}
