import React from "react";
import { Box, Button, Stack } from "@mui/material";

function PageComponent({ serverData, movePage }) {
    return (
        <Box mt={4} display="flex" justifyContent="center">
            <Stack direction="row" spacing={1}>
                {/* Prev 버튼 */}
                {serverData.prev && (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => movePage({ page: serverData.prevPage })}
                    >
                        Prev
                    </Button>
                )}

                {/* 숫자 페이지 버튼 */}
                {serverData.pageNumList.map((pageNum) => (
                    <Button
                        key={pageNum}
                        variant={serverData.current === pageNum ? "contained" : "outlined"}
                        color={serverData.current === pageNum ? "secondary" : "primary"}
                        onClick={() => movePage({ page: pageNum })}
                    >
                        {pageNum}
                    </Button>
                ))}

                {/* Next 버튼 */}
                {serverData.next && (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => movePage({ page: serverData.nextPage })}
                    >
                        Next
                    </Button>
                )}
            </Stack>
        </Box>
    );
}

export default PageComponent;
