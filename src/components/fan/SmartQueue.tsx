import React, { useState } from 'react';
import { validateFoodOrder } from '../../utils/validation';
import { sanitizeInput } from '../../utils/security';
import { ShoppingBag, Clock, MapPin, CheckCircle, AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import { getTranslatedFood, getTranslatedStand } from '../../utils/translations';
import type { Language } from '../../utils/translations';
import { speakText, stopSpeech } from '../../utils/speech';

interface ConcessionStand {
  id: string;
  name: string;
  cuisine: string;
  waitTime: number; // minutes
  queueLength: number; // people
  location: string;
  menu: { item: string; price: number }[];
}

const CONCESSIONS: ConcessionStand[] = [
  {
    id: 'c1',
    name: 'MetLife Grill (Burgers & Fries)',
    cuisine: 'American',
    waitTime: 12,
    queueLength: 18,
    location: 'North Concourse - Sect 114',
    menu: [
      { item: 'World Cup Double Burger', price: 14.5 },
      { item: 'Stadium Loaded Fries', price: 8.0 },
      { item: 'Soft Drink (Eco-Cup)', price: 5.5 }
    ]
  },
  {
    id: 'c2',
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    waitTime: 4,
    queueLength: 6,
    location: 'East Concourse - Sect 128',
    menu: [
      { item: 'Trio Chicken Tacos', price: 12.0 },
      { item: 'Nachos Supreme', price: 9.5 },
      { item: 'Aguas Frescas (Eco-Cup)', price: 6.0 }
    ]
  },
  {
    id: 'c3',
    name: 'Maple Poutine & Dogs',
    cuisine: 'Canadian',
    waitTime: 9,
    queueLength: 14,
    location: 'South Concourse - Sect 142',
    menu: [
      { item: 'Classic Maple Poutine', price: 11.0 },
      { item: 'Jumbo Stadium Hotdog', price: 7.5 },
      { item: 'Craft Beer (Eco-Cup)', price: 9.5 }
    ]
  }
];

interface SmartQueueProps {
  currentLang: Language;
  t: (key: any) => string;
}

/**
 * SmartQueue Component
 * Manages concession stand selection, menu pre-ordering, and simulated queue length wait times.
 * Wrapped in React.memo for component optimization.
 */
const SmartQueueComponent: React.FC<SmartQueueProps> = ({ currentLang, t }) => {
  const [selectedStand, setSelectedStand] = useState<ConcessionStand>(CONCESSIONS[0]);
  const [customerName, setCustomerName] = useState('');
  const [seatLocation, setSeatLocation] = useState('');
  const [selectedItem, setSelectedItem] = useState(CONCESSIONS[0].menu[0].item);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<Array<{ id: string; stand: string; item: string; qty: number; status: string }>>([]);

  const handleStandChange = (stand: ConcessionStand) => {
    setSelectedStand(stand);
    setSelectedItem(stand.menu[0].item);
    setError(null);
    setSuccess(null);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 1. Sanitize text inputs
    const sanitizedName = sanitizeInput(customerName);
    const sanitizedSeat = sanitizeInput(seatLocation);

    // 2. Perform validation checks
    const validation = validateFoodOrder({
      item: selectedItem,
      quantity,
      customerName: sanitizedName,
      seatLocation: sanitizedSeat
    });

    if (!validation.isValid) {
      setError(validation.error ? t(validation.error as any) : t('orderValidationError'));
      return;
    }

    // 3. Process mock success
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const trStand = getTranslatedStand(selectedStand.id, currentLang);
    const successMsg = t('orderSuccessMsg')
      .replace('{orderId}', newOrderId)
      .replace('{location}', trStand.location)
      .replace('{waitTime}', String(selectedStand.waitTime));
      
    setSuccess(successMsg);
    
    setRecentOrders(prev => [
      {
        id: newOrderId,
        stand: trStand.name,
        item: getTranslatedFood(selectedItem, currentLang).name,
        qty: quantity,
        status: t('preparingStatus')
      },
      ...prev
    ]);

    // Reset order form inputs
    setCustomerName('');
    setSeatLocation('');
    setQuantity(1);
  };

  return (
    <div className="smart-queue-container fan-grid-equal" style={{ display: 'grid', gap: '20px' }}>
      {/* Concession Stand Selector */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag style={{ color: 'var(--primary)' }} />
          {t('concessionTitle')}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          {t('concessionDesc')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CONCESSIONS.map(stand => {
            const trStand = getTranslatedStand(stand.id, currentLang);
            return (
              <button
                key={stand.id}
                onClick={() => handleStandChange(stand)}
                style={{
                  textAlign: 'left',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedStand.id === stand.id ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  border: `1px solid ${selectedStand.id === stand.id ? 'var(--primary)' : 'var(--border-color)'}`,
                  transition: 'all var(--transition-fast)'
                }}
                aria-label={`Select ${trStand.name}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  <span>{trStand.name}</span>
                  <span style={{ color: 'var(--secondary)' }}>{trStand.cuisine}</span>
                </div>
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} style={{ color: 'var(--primary)' }} />
                    {stand.waitTime} {currentLang === 'es' ? 'min de espera' : currentLang === 'fr' ? 'min d\'attente' : 'min wait'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} />
                    {trStand.location}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Express Order Form */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{t('orderFormTitle')}</span>
          {success && (
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => speakText(success, currentLang)}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 6px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem'
                }}
                title={t('ttsSpeakBtn')}
                aria-label={t('ttsSpeakBtn')}
              >
                <Volume2 size={13} />
              </button>
              <button
                type="button"
                onClick={stopSpeech}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--danger)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 6px',
                  borderRadius: 'var(--radius-sm)'
                }}
                aria-label="Stop reading"
              >
                <VolumeX size={13} />
              </button>
            </div>
          )}
        </h3>
        
        <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="food-item" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
              {t('selectItemLabel')}
            </label>
            <select
              id="food-item"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {selectedStand.menu.map(menuItem => {
                const trFood = getTranslatedFood(menuItem.item, currentLang);
                return (
                  <option key={menuItem.item} value={menuItem.item}>
                    {trFood.name} - ${menuItem.price.toFixed(2)}
                  </option>
                );
              })}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label htmlFor="order-qty" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
                {t('quantityLabel')}
              </label>
              <input
                id="order-qty"
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }}
              />
            </div>
            <div>
              <label htmlFor="seat-location" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
                {t('seatLocationLabel')}
              </label>
              <input
                id="seat-location"
                type="text"
                placeholder="A102-12"
                value={seatLocation}
                onChange={(e) => setSeatLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="customer-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
              {t('customerNameLabel')}
            </label>
            <input
              id="customer-name"
              type="text"
              placeholder={t('customerNamePlaceholder')}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
              required
            />
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontSize: '0.85rem' }} role="alert">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '0.85rem' }} role="status">
              <CheckCircle size={16} />
              <span style={{ flex: 1 }}>{success}</span>
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--gradient-primary)',
              color: '#000',
              fontWeight: 'bold',
              transition: 'transform var(--transition-fast)'
            }}
          >
            {t('expressOrderButton')}
          </button>
        </form>

        {recentOrders.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>{t('recentOrdersTitle')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
              {recentOrders.map(order => (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{order.id}</span> - {order.stand} ({order.qty}x {order.item})
                  </div>
                  <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>{order.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export const SmartQueue = React.memo(SmartQueueComponent);
SmartQueue.displayName = 'SmartQueue';


