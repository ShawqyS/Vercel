"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import config from "@/config/config.json";
import { getActiveLanguages } from "@/lib/languageParser";
import { slugSelector } from "@/lib/utils/slugSelector";
import { INavigationLink } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

const Header = ({
  lang,
  menu,
}: {
  lang: string;
  menu: { main: INavigationLink[] };
}) => {
  const activeLanguages = getActiveLanguages();
  const { main }: { main: INavigationLink[] } = menu;
  const { navigation_button, settings } = config;
  const pathname = usePathname();

  // State to track open menus
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  // scroll to top on route change
  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  const toggleMenu = (index: string, parentIndex?: string) => {
    if (parentIndex === "3") {
      // Handle toggling for "Productos" children (e.g., Kote, Mallas)
      setOpenMenus((prev) => {
        const newOpenMenus = { ...prev };

        // Close other siblings under "Productos"
        Object.keys(newOpenMenus).forEach((key) => {
          if (key.startsWith(parentIndex) && key !== index) {
            newOpenMenus[key] = false;
          }
        });

        // Toggle the clicked child menu, but ensure "Productos" stays open
        return {
          ...newOpenMenus,
          [index]: !prev[index],
          "3": true, // Ensure "Productos" remains open
        };
      });
    } else {
      // Toggle "Productos" or other main menu items
      setOpenMenus((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
  };

  const renderMenuItems = (
    items: INavigationLink[],
    parentIndex?: string
  ) => {
    return items.map((item, i) => {
      const currentIndex = parentIndex ? `${parentIndex}-${i}` : `${i}`;
      const isOpen = openMenus[currentIndex];

      return (
        <React.Fragment key={`menu-item-${currentIndex}`}>
          {item.hasChildren ? (
            <li className="nav-item nav-dropdown group relative">
              <span
                className={`nav-link inline-flex items-center cursor-pointer ${
                  item.children?.map(({ url }) => url).includes(pathname) ||
                  item.children
                    ?.map(({ url }) => `${url}/`)
                    .includes(pathname)
                    ? "active"
                    : ""
                }`}
                onClick={() => toggleMenu(currentIndex, parentIndex)}
              >
                {item.name}
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </span>
              <ul
                className={`nav-dropdown-list ${
                  isOpen ? "block" : "hidden"
                } absolute top-0 left-full ml-2 bg-white dark:bg-darkmode-background lg:group-hover:visible lg:group-hover:opacity-100`}
              >
                {renderMenuItems(item.children || [], currentIndex)}
              </ul>
            </li>
          ) : (
            <li className="nav-item">
              <Link
                href={slugSelector(lang, item.url)}
                className={`nav-link block ${
                  (pathname === `${item.url}/` || pathname === item.url) &&
                  "active"
                }`}
              >
                {item.name}
              </Link>
            </li>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <header
      style={{ paddingBottom: "0px" }}
      className={`header z-30 ${settings.sticky_header && "sticky top-0"}`}
    >
      <nav className="navbar container">
        {/* logo */}
        <div className="order-0">
          <Logo lang={lang} />
        </div>
        {/* navbar toggler */}
        <input id="nav-toggle" type="checkbox" className="hidden" />
        <label
          htmlFor="nav-toggle"
          className="order-3 cursor-pointer flex items-center lg:hidden text-dark dark:text-white lg:order-1"
        >
          <svg
            id="show-button"
            className="h-6 fill-current block"
            viewBox="0 0 20 20"
          >
            <title>Menu Open</title>
            <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z"></path>
          </svg>
          <svg
            id="hide-button"
            className="h-6 fill-current hidden"
            viewBox="0 0 20 20"
          >
            <title>Menu Close</title>
            <polygon
              points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
              transform="rotate(45 10 10)"
            ></polygon>
          </svg>
        </label>
        {/* /navbar toggler */}

        <ul
          id="nav-menu"
          className="navbar-nav order-3 hidden w-full pb-6 lg:order-1 lg:flex lg:w-auto lg:space-x-2 lg:pb-0 xl:space-x-8"
        >
          {renderMenuItems(main)}
        </ul>
        <div className="order-1 ml-auto flex items-center md:order-2 lg:ml-0">
          {settings.search && (
            <button
              className="border-border text-dark hover:text-primary dark:border-darkmode-border mr-5 inline-block border-r pr-5 text-xl dark:text-white dark:hover:text-darkmode-primary"
              aria-label="search"
              data-search-trigger
            >
              <IoSearch />
            </button>
          )}
          <ThemeSwitcher className="mr-5" />

          {activeLanguages.length > 1 && (
            <LanguageSwitcher
              lang={lang}
              className="mr-5 pl-2 py-1 dark:bg-darkmode-theme-light rounded"
            />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
