import React, { useState, useEffect } from 'react';
import { GeocodingResult } from '../services/geocodingService';
import { NeighborhoodData } from '../crimeDataService';
import { getNeighborhoodInfo } from '../data/neighborhoodInfo';
import jsPDF from 'jspdf';
import './FavoritesManager.css';

interface SavedAddress {
  id: string;
  address: string;
  lat: number;
  lon: number;
  neighborhoodName?: string;
  savedAt: number;
  notes?: string;
}

interface FavoritesManagerProps {
  neighborhoods: NeighborhoodData[];
  onLocationSelect?: (lat: number, lon: number) => void;
}

const STORAGE_KEY = 'la-crime-map-favorites';

export const FavoritesManager: React.FC<FavoritesManagerProps> = ({ neighborhoods, onLocationSelect }) => {
  const [favorites, setFavorites] = useState<SavedAddress[]>([]);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: SavedAddress[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const addFavorite = (location: GeocodingResult, neighborhoodName?: string) => {
    const newFavorite: SavedAddress = {
      id: Date.now().toString(),
      address: location.display_name,
      lat: location.lat,
      lon: location.lon,
      neighborhoodName,
      savedAt: Date.now(),
    };

    saveFavorites([...favorites, newFavorite]);
  };

  const removeFavorite = (id: string) => {
    saveFavorites(favorites.filter(f => f.id !== id));
    setSelectedForComparison(selectedForComparison.filter(sid => sid !== id));
  };

  const updateNotes = (id: string, notes: string) => {
    saveFavorites(favorites.map(f => f.id === id ? { ...f, notes } : f));
    setEditingId(null);
    setEditNotes('');
  };

  const toggleComparison = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter(sid => sid !== id));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison([...selectedForComparison, id]);
    }
  };

  const exportToPDF = () => {
    const selected = favorites.filter(f => selectedForComparison.includes(f.id));

    if (selected.length === 0) {
      alert('Please select at least one address to export');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(20);
    doc.text('LA Apartment Comparison', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });

    let yPos = 40;

    selected.forEach((fav, index) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Address header
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${fav.address}`, 15, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      // Neighborhood info
      if (fav.neighborhoodName) {
        const neighborhood = neighborhoods.find(n => n.name === fav.neighborhoodName);
        const info = getNeighborhoodInfo(fav.neighborhoodName);

        if (neighborhood) {
          doc.text(`Neighborhood: ${fav.neighborhoodName}`, 20, yPos);
          yPos += 6;

          // Crime stats
          doc.text(`Crime Statistics (per week):`, 20, yPos);
          yPos += 5;
          doc.text(`  - Violent Crime: ${neighborhood.violentCrime}`, 25, yPos);
          yPos += 5;
          doc.text(`  - Car Theft: ${neighborhood.carTheft}`, 25, yPos);
          yPos += 5;
          doc.text(`  - Break-ins: ${neighborhood.breakIns}`, 25, yPos);
          yPos += 5;
          doc.text(`  - Petty Theft: ${neighborhood.pettyTheft}`, 25, yPos);
          yPos += 7;

          // Rent info
          doc.text(`Average Rent:`, 20, yPos);
          yPos += 5;
          doc.text(`  - 1 Bedroom: $${info.avgRent1BR.toLocaleString()}/month`, 25, yPos);
          yPos += 5;
          doc.text(`  - 2 Bedroom: $${info.avgRent2BR.toLocaleString()}/month`, 25, yPos);
          yPos += 7;

          // Scores
          doc.text(`Livability Scores:`, 20, yPos);
          yPos += 5;
          doc.text(`  - Walk Score: ${info.walkScore}/100`, 25, yPos);
          yPos += 5;
          doc.text(`  - Bike Score: ${info.bikeScore}/100`, 25, yPos);
          yPos += 5;
          doc.text(`  - Transit Score: ${info.transitScore}/100`, 25, yPos);
          yPos += 5;
          doc.text(`  - School Rating: ${info.schoolRating}/10`, 25, yPos);
          yPos += 7;

          // Environmental factors
          doc.text(`Environment: ${info.noiseLevel} noise level`, 20, yPos);
          yPos += 5;
          if (info.nearAirport) {
            doc.text(`  - Near airport (may have flight noise)`, 25, yPos);
            yPos += 5;
          }
          if (info.nearFreeway) {
            doc.text(`  - Near freeway (may have traffic noise)`, 25, yPos);
            yPos += 5;
          }
          yPos += 3;

          // Vibe
          doc.text(`Vibe: ${info.vibe.join(', ')}`, 20, yPos);
          yPos += 7;
        }
      }

      // Notes
      if (fav.notes) {
        doc.setFont('helvetica', 'italic');
        doc.text(`Notes: ${fav.notes}`, 20, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += 7;
      }

      // Separator
      doc.setDrawColor(200, 200, 200);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 10;
    });

    // Footer (simplified for jsPDF v1 compatibility)
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      'LA Crime Map - https://la-crime-map.vercel.app',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );

    doc.save(`LA-Apartment-Comparison-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="favorites-manager">
      <div className="favorites-header">
        <h3>Saved Addresses ({favorites.length})</h3>
        {selectedForComparison.length > 0 && (
          <button className="export-pdf-button" onClick={exportToPDF}>
            Export PDF ({selectedForComparison.length})
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>No saved addresses yet.</p>
          <p className="hint">Search for an address and save it to compare later!</p>
        </div>
      ) : (
        <div className="favorites-list">
          {favorites.map(fav => (
            <div
              key={fav.id}
              className={`favorite-item ${selectedForComparison.includes(fav.id) ? 'selected' : ''}`}
            >
              <div className="favorite-header">
                <input
                  type="checkbox"
                  checked={selectedForComparison.includes(fav.id)}
                  onChange={() => toggleComparison(fav.id)}
                  disabled={!selectedForComparison.includes(fav.id) && selectedForComparison.length >= 3}
                  title="Select for comparison (max 3)"
                />
                <div className="favorite-info">
                  <div className="favorite-address">{fav.address}</div>
                  {fav.neighborhoodName && (
                    <div className="favorite-neighborhood">{fav.neighborhoodName}</div>
                  )}
                  <div className="favorite-date">
                    Saved {new Date(fav.savedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="favorite-actions">
                  {onLocationSelect && (
                    <button
                      className="action-button view-button"
                      onClick={() => onLocationSelect(fav.lat, fav.lon)}
                      title="View on map"
                    >
                      View
                    </button>
                  )}
                  <button
                    className="action-button delete-button"
                    onClick={() => removeFavorite(fav.id)}
                    title="Remove"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {editingId === fav.id ? (
                <div className="notes-editor">
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes (e.g., 'Close to work', 'Quiet street', etc.)"
                    rows={3}
                  />
                  <div className="editor-buttons">
                    <button onClick={() => updateNotes(fav.id, editNotes)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="notes-display">
                  {fav.notes ? (
                    <p>{fav.notes}</p>
                  ) : (
                    <p className="no-notes">No notes</p>
                  )}
                  <button
                    className="edit-notes-button"
                    onClick={() => {
                      setEditingId(fav.id);
                      setEditNotes(fav.notes || '');
                    }}
                  >
                    {fav.notes ? 'Edit Notes' : 'Add Notes'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedForComparison.length > 0 && (
        <div className="comparison-hint">
          Selected {selectedForComparison.length} of 3 addresses for comparison.
          Click "Export PDF" to generate a detailed comparison report.
        </div>
      )}
    </div>
  );
};

// Export the SavedAddress type for use in parent components
export type { SavedAddress };
