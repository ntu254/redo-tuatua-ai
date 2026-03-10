

## Plan: Di chuyển nút Replace và gộp Regenerate

### Thay đổi 1: `OutfitCard.tsx`
- **Xóa** nút RefreshCw icon cạnh title (dòng 130-136)
- **Xóa** nút "Replace" ở footer (dòng 233-239)
- Giữ lại nút "Buy Outfit" làm CTA chính duy nhất trong footer, căn phải

### Thay đổi 2: `OutfitHeader.tsx`
- Thay nút "Regenerate" text button bằng **icon button tròn** với icon RefreshCw, màu coral (accent), kích thước lớn hơn, giống reference image user gửi
- Xóa nút "Filters" outline (hoặc giữ tùy ý — nhưng Regenerate là focus chính)

### Thay đổi 3: `ChatSidebar.tsx`
- Thêm nút **"Replace Item"** vào khu vực quick prompts hoặc như một action riêng trong sidebar, cho phép user yêu cầu AI thay thế item cụ thể qua chat

Tóm lại: mỗi outfit card chỉ còn nút "Buy Outfit", refresh chung 1 chỗ ở header, và "Replace" chuyển sang sidebar AI để user mô tả muốn thay item nào.

