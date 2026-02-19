import { TrendItemStyled } from "./TrendItem.styles";

interface TrendItemProps {
  category: string;
  title: string;
  posts?: string;
  themeMode: "light" | "dark";
}

export const TrendItem = ({
  category,
  title,
  posts,
  themeMode,
}: TrendItemProps) => {
  return (
    <TrendItemStyled $themeMode={themeMode}>
      <strong>{category}</strong>
      <span>{title}</span>
      {posts && <span>{posts} posts</span>}
    </TrendItemStyled>
  );
};
