'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DatabaseTest() {
  const [status, setStatus] = useState<string>('Testing...');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('Connecting to Supabase...');

      // Test 1: Fetch products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(5);

      if (productsError) {
        throw new Error(`Products query failed: ${productsError.message}`);
      }

      setData(products);
      setStatus('✅ Database Connected Successfully!');
    } catch (err: any) {
      setError(err.message);
      setStatus('❌ Connection Failed');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-ladybug-crimson rounded-lg p-6 max-w-sm shadow-lg z-[999]">
      <h3 className="text-lg font-bold text-ladybug-dark mb-2">Database Status</h3>
      <p className="text-sm mb-4">
        {status}
      </p>

      {data && (
        <div className="bg-ladybug-bg p-4 rounded text-sm mb-4">
          <p className="font-semibold text-ladybug-dark mb-2">Found {data.length} Products:</p>
          <ul className="space-y-1">
            {data.map((product: any) => (
              <li key={product.id} className="text-ladybug-dark">
                • {product.name} (slug: {product.slug})
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-500 p-4 rounded text-sm">
          <p className="font-semibold text-red-700 mb-2">Error:</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={testConnection}
        className="w-full bg-ladybug-crimson text-white py-2 rounded font-semibold hover:bg-red-700 transition text-sm"
      >
        Test Again
      </button>
    </div>
  );
}
