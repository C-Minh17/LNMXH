import { useModel, useParams } from "@umijs/max"
import { useEffect } from "react"

const PostDetail = () => {
  const { post_id } = useParams<{ post_id: string }>()
  const { postv2Detail, postv2DetailLoading, handleGetPostV2Detail } = useModel("manage-post.manage-post")

  useEffect(() => {
    if (post_id) {
      handleGetPostV2Detail(Number(post_id))
    }
  }, [post_id])

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '---';
    return new Date(timestamp * 1000).toLocaleString('vi-VN');
  }

  const styles = {
    row: {
      display: 'flex',
      borderBottom: '1px dashed #e0e0e0',
      padding: '15px 0',
      alignItems: 'baseline'
    } as React.CSSProperties,
    label: {
      width: '160px',
      minWidth: '160px',
      fontWeight: 'bold',
      color: '#555',
      fontSize: '14px'
    } as React.CSSProperties,
    value: {
      flex: 1,
      color: '#222',
      fontSize: '15px',
      lineHeight: '1.6',
      wordBreak: 'break-word'
    } as React.CSSProperties
  }

  if (postv2DetailLoading) return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>
  if (!postv2Detail) return <div style={{ padding: 20 }}>Không tìm thấy dữ liệu</div>

  return (
    <div style={{
      maxWidth: '900px',
      margin: '20px auto',
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>

      <h2 style={{
        margin: '0 0 30px 0',
        paddingBottom: '15px',
        borderBottom: '2px solid #1890ff',
        color: '#1890ff'
      }}>
        Chi tiết dữ liệu (Inspector)
      </h2>

      <div style={styles.row}>
        <div style={styles.label}>ID:</div>
        <div style={styles.value}>{postv2Detail.id}</div>
      </div>

      <div style={styles.row}>
        <div style={styles.label}>Tiêu đề:</div>
        <div style={{ ...styles.value, fontWeight: 600, fontSize: '16px' }}>
          {postv2Detail.title}
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.label}>Nội dung:</div>
        <div style={{ ...styles.value, textAlign: 'justify' }}>
          {postv2Detail.content}
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.label}>Đường dẫn (URL):</div>
        <div style={styles.value}>
          {postv2Detail.url ? (
            <a href={postv2Detail.url} target="_blank" rel="noreferrer" style={{ color: '#1890ff' }}>
              {postv2Detail.url}
            </a>
          ) : '---'}
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.label}>Loại dữ liệu:</div>
        <div style={styles.value}>
          <span style={{ background: '#f0f5ff', color: '#2f54eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
            {postv2Detail.data_type}
          </span>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.label}>Loại tài liệu:</div>
        <div style={styles.value}>{postv2Detail.document_type}</div>
      </div>

      <div style={styles.row}>
        <div style={styles.label}>Ngày tạo:</div>
        <div style={styles.value}>{formatDate(postv2Detail.created_at)}</div>
      </div>

      <div style={styles.row}>
        <div style={styles.label}>Ngày cập nhật:</div>
        <div style={styles.value}>{formatDate(postv2Detail.updated_at)}</div>
      </div>

      {/* --- PHẦN META_DATA HIỂN THỊ JSON --- */}

      <div style={{ ...styles.row, borderBottom: 'none', flexDirection: 'column' }}>
        <div style={{ ...styles.label, marginBottom: '10px', width: '100%' }}>
          Meta Data (JSON):
        </div>
        <div style={{ width: '100%' }}>
          <pre style={{
            backgroundColor: '#282c34',
            color: '#abb2bf',
            padding: '20px',
            borderRadius: '6px',
            overflowX: 'auto',
            fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
            fontSize: '13px',
            margin: 0
          }}>
            {JSON.stringify(postv2Detail.meta_data, null, 2)}
          </pre>
        </div>
      </div>

    </div>
  )
}

export default PostDetail