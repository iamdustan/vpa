export interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  datePosted?: string;
  description?: string;
}

export interface JobFetcher {
  fetch(query: string, options?: { unfiltered?: boolean }): Promise<JobPost[]>;
}
