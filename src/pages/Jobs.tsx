import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobCard from "@/components/jobs/JobCard";
import { jobApi } from "@/lib/api";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const JOBS_PER_PAGE = 10;

const Jobs = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['jobs', page, search],
    queryFn: () => jobApi.getJobsPaginated({ page, limit: JOBS_PER_PAGE, search }),
    placeholderData: (prev) => prev,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const jobs = data?.jobs || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const goToPage = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('ellipsis');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <Helmet>
        <title>Legal Job Vacancies | Jan Justice - Find Your Next Legal Role</title>
        <meta name="description" content="Browse legal job vacancies across India. Find advocate, counsel, judge, and legal professional positions at courts, law firms, and government departments." />
      </Helmet>

      <div className="bg-background min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow flex flex-col items-center">
          <div className="w-full max-w-5xl px-4 lg:px-8 py-8 flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl lg:text-4xl font-black">Legal Job Vacancies</h1>
                  <p className="text-muted-foreground text-base font-medium">
                    {isLoading && jobs.length === 0
                      ? 'Loading...'
                      : search
                        ? `${total} result${total !== 1 ? 's' : ''} for "${search}"`
                        : `Showing ${total > 0 ? (page - 1) * JOBS_PER_PAGE + 1 : 0}-${Math.min(page * JOBS_PER_PAGE, total)} of ${total} openings`}
                  </p>
                </div>
                {isFetching && jobs.length > 0 && (
                  <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin shrink-0" />
                )}
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search by title, department, location (e.g. Advocate, Judge, Delhi)..."
                      className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <Button type="submit" className="h-11 px-6 gradient-primary border-0 shadow-glow hover:shadow-glow-lg transition-all">
                    Search
                  </Button>
                </div>
              </form>
            </div>

            <div className="border-b border-border" />

            <div className="flex flex-col gap-5">
              {isLoading && jobs.length === 0 && (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3" />
                  <p className="text-muted-foreground">Loading jobs...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-10">
                  <p className="text-destructive">Error loading jobs. Please try again later.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Make sure the backend server is running.
                  </p>
                </div>
              )}

              {!isLoading && !error && jobs.length === 0 && (
                <div className="text-center py-10">
                  {search ? (
                    <>
                      <p className="text-muted-foreground">No jobs found for "{search}"</p>
                      <Button variant="link" className="mt-2 text-primary" onClick={clearSearch}>
                        Clear search
                      </Button>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No legal job vacancies available at the moment. Check back soon!</p>
                  )}
                </div>
              )}

              {!error && jobs.map((job, index) => (
                <div key={job._id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <JobCard
                    id={job._id}
                    title={job.title}
                    company={job.company}
                    department={job.department}
                    description={job.description}
                    postDate={job.postDate || job.createdAt}
                    tags={job.tags}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  disabled={page === 1}
                  onClick={() => goToPage(1)}
                  title="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  disabled={page === 1}
                  onClick={() => goToPage(page - 1)}
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((p, i) =>
                  p === 'ellipsis' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="icon"
                      className={`h-9 w-9 ${p === page ? 'gradient-primary border-0 shadow-glow' : ''}`}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  disabled={page === totalPages}
                  onClick={() => goToPage(page + 1)}
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  disabled={page === totalPages}
                  onClick={() => goToPage(totalPages)}
                  title="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Jobs;
