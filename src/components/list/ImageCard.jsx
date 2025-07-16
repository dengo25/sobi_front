import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CustomButton from "../input/CustomButton";
import { stripHtml } from "../../utils/common";
import noImg from "../../assets/images/img-noimg.png" // 경로 이슈로 임포트 처리


const ImageCard = ({
  items,
  width,
  height,
  type,
  onItemClick,
}) => {
    const handleItemClick = (item, index) => {
    if (onItemClick) {
      onItemClick(type, item.no || item.id, item, index);
    }
  };

  return (
    <>
      {items.map((item,idx) => (
        <Card sx={{ minWidth: 345 }} key={idx} className="card-basic">
          <CardMedia
            sx={{ width: 300, height: 300 }}
            image={
              item.img
                ? `${item.img}?w=248&fit=crop&auto=format`
                : noImg
            }
            title={item.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {item.title}
            </Typography>
            <div
              dangerouslySetInnerHTML={{ __html: stripHtml(item.content) }}
              className="custom-body"
            ></div>
          </CardContent>
          <CardActions>
            <CustomButton
              type="button"
              size="medium"
              variant="contained"
              color="success"
              text="더보기"
              onClick={() => handleItemClick(item, idx)}
            />
          </CardActions>
        </Card>
      ))}
    </>
  );
};

export default ImageCard;