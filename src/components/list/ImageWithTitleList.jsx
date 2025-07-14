import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

const ImageWithTitleList = ({
    items,
    width = '100%',
    height = '100%',
    cols = 3,
    gap = 8
}) => {
  return (
    <Box sx={{ width, height, overflowY: "auto" }}>
      <ImageList variant="masonry" cols={cols} gap={gap}>
        {items.map((item, idx) => (
          <ImageListItem key={idx}>
            <img
              src={ item.img ? `${item.img}?w=248&fit=crop&auto=format` : `src/assets/images/img-noimg.png`}
              srcSet={item.img ? `${item.img}?w=248&fit=crop&auto=format&dpr=2 2x` : `src/assets/images/img-noimg.png`}
              alt={item.title+` 게시글 타이틀 이미지`}
              loading="lazy"
            />
            <ImageListItemBar position="below" title={item.title} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default ImageWithTitleList;
