import { paths } from "@/routes/paths";
import type { ContentSectionKey } from "./types";

export interface ContentSection {
  title: string;
  subtitle: string;
  /** Endpoint names are spelled as the API defines them (including "Conditons"). */
  listEndpoint: string;
  updateEndpoint: (entryId: number) => string;
  viewPath: string;
  editPath: string;
  /** About Us only lets admins change the body text. */
  headingEditable: boolean;
}

export const CONTENT_SECTIONS: Record<ContentSectionKey, ContentSection> = {
  terms: {
    title: "Terms & conditions",
    subtitle: "The terms users agree to in the app",
    listEndpoint: "content/getAllTermsAndConditonsByAdmin",
    updateEndpoint: (entryId) => `content/updateTermsAndConditons/${entryId}`,
    viewPath: paths.terms,
    editPath: paths.editTerms,
    headingEditable: true,
  },
  about: {
    title: "About us",
    subtitle: "The About Us page shown in the app",
    listEndpoint: "content/getAllAboutUsByAdmin",
    updateEndpoint: (entryId) => `content/updateAboutUs/${entryId}`,
    viewPath: paths.about,
    editPath: paths.editAbout,
    headingEditable: false,
  },
};
