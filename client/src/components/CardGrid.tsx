import { useEffect, useState } from "react";
import type { Card } from "../types/Card";
import { cardService } from "../utils/cardService";
import CardDisplay from "./CardDisplay";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Full card display component for grid
function CardGridItem({
  uuid,
  onClick,
}: {
  uuid: string;
  onClick: (card: Card) => void;
}) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cardService.fetchCard(uuid).then((cardData) => {
      setCard(cardData);
      setLoading(false);
    });
  }, [uuid]);

  if (loading) {
    return (
      <div className="border rounded-lg p-4 h-64 bg-gray-100 animate-pulse"></div>
    );
  }

  if (!card) return null;

  return (
    <div
      className="cursor-pointer w-60 h-90 flex justify-center items-center"
      onClick={() => onClick(card)}
    >
      <div className="scale-60 hover:scale-100 transition-all duration-150 origin-center z-0 hover:z-20">
        <CardDisplay card={card} />{" "}
      </div>
    </div>
  );
}

interface CardGridProps {
  onCardSelect: (card: Card) => void;
}

export default function CardGrid({ onCardSelect }: CardGridProps) {
  const [uuids, setUuids] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCards: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [pageSize, setPageSize] = useState(20);

  const fetchCards = async (page: number) => {
    setLoading(true);
    const response = await cardService.fetchAllCardUuids(page, pageSize);
    if (response) {
      setUuids(response.uuids);
      setPagination(response.pagination);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCards(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading cards...</div>;
  }

  if (uuids.length === 0) {
    return <div>There are no cards that match your filters.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {uuids.map((uuid) => (
          <CardGridItem key={uuid} uuid={uuid} onClick={onCardSelect} />
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                pagination.hasPreviousPage && handlePageChange(currentPage - 1)
              }
              className={
                !pagination.hasPreviousPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          {currentPage > 2 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationEllipsis />
            </>
          )}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink isActive={true}>{currentPage}</PaginationLink>
          </PaginationItem>
          {currentPage < pagination.totalPages && (
            <PaginationItem onClick={() => handlePageChange(currentPage + 1)}>
              <PaginationLink>{currentPage + 1}</PaginationLink>
            </PaginationItem>
          )}
          {currentPage < pagination.totalPages - 1 && (
            <>
              <PaginationEllipsis />
              <PaginationItem
                onClick={() => handlePageChange(pagination.totalPages)}
              >
                <PaginationLink>{pagination.totalPages}</PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                pagination.hasNextPage && handlePageChange(currentPage + 1)
              }
              className={
                !pagination.hasNextPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          <PaginationItem>
            <Select onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Set Page Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
