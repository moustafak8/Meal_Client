import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { type item, type unit } from "../api/pantry";
import "../pages/pantry.css";

interface PantryItemsListProps {
  items: item[];
  units: unit[];
  loading?: boolean;
  selectedItems?: Set<number>;
  onToggleSelect?: (itemId: number) => void;
  onConsume?: (itemId: number) => void;
  onDelete?: (itemId: number) => void;
  showCheckboxes?: boolean;
  showActions?: boolean;
  emptyMessage?: string;
}

export const PantryItemsList = ({
  items,
  units,
  loading = false,
  selectedItems,
  onToggleSelect,
  onConsume,
  onDelete,
  showCheckboxes = false,
  showActions = true,
  emptyMessage = "No items in pantry yet. Add some ingredients to get started!",
}: PantryItemsListProps) => {
  const getUnitName = (unitId: number) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : "";
  };

  return (
    <div className="pantry-items-container">
      {loading ? (
        <p>Loading pantry items...</p>
      ) : items.length === 0 ? (
        <p className="no-items">{emptyMessage}</p>
      ) : (
        items.map((item) => {
          const unitName = getUnitName(item.unit_id);
          return (
            <div key={item.id} className="pantry-item-row">
              {showCheckboxes && onToggleSelect && (
                <input
                  type="checkbox"
                  checked={selectedItems?.has(item.id) || false}
                  onChange={() => onToggleSelect(item.id)}
                  className="item-checkbox"
                />
              )}
              <span className="item-name">
                {item.quantity} {unitName} {item.name}
              </span>
              {showActions && (
                <div className="item-actions">
                  {onConsume && (
                    <button
                      className="consume-btn"
                      onClick={() => onConsume(item.id)}
                    >
                      Consume
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="delete-btn"
                      title="Delete"
                      onClick={() => onDelete(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

